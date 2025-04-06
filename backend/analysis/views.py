from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import numpy as np
from scipy.stats import shapiro, norm
import matplotlib.pyplot as plt
import os

from backend import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class AnalyzeDataView(APIView):
    def calculate_sd(self, delta):
        return delta.mean(), delta.std(ddof=1)

    def calculate_inverse_sigma(self, delta, delta_se):
        weights = 1 / delta_se
        inverse_sigma = np.sqrt(1 / weights.sum())
        inverse_sigma_mean = np.sum(delta * weights) / weights.sum()
        return inverse_sigma_mean, inverse_sigma

    def calculate_mc(self, delta, delta_se):
        n = 10000
        mean_delta = delta.mean()
        sims = []

        for _ in range(n):
            noise = np.random.normal(0, delta_se)
            simulated = delta + noise - mean_delta
            sims.append(simulated.std())
        return mean_delta, np.mean(sims)

    def generate_half_violin_plot(self, delta, delta_se, sd_mean, sd, inverse_sigma_mean, inverse_sigma, mc_mean, mc):
        fig, ax = plt.subplots(figsize=(12, 5))

        for i in range(len(delta)):
            mu = delta[i]
            sigma = delta_se[i]
            x_vals = np.linspace(mu - 3*sigma, mu + 3*sigma, 100)
            pdf_vals = norm.pdf(x_vals, loc=mu, scale=sigma)

            ax.fill_betweenx(x_vals, i + pdf_vals / pdf_vals.max() * 0.4, i,
                     facecolor='grey', alpha=0.8)

        stats = [
            ("SD", sd_mean, sd, '#6ca6cd'),
            ("Inverse Sigma", inverse_sigma_mean, inverse_sigma, '#ad7f97'),
            ("MC", mc_mean, mc, '#ff8f89')
        ]
        offset = len(delta)
        for j, (label, mu, sigma, color) in enumerate(stats):
            x_vals = np.linspace(mu - 3 * sigma, mu + 3 * sigma, 100)
            pdf_vals = norm.pdf(x_vals, loc=mu, scale=sigma)
            index = offset + j
            ax.fill_betweenx(x_vals, index + pdf_vals / pdf_vals.max() * 0.4, index,
                         facecolor=color, alpha=0.8, label=label)

        total_labels = [str(i + 1) for i in range(len(delta) + len(stats))]
        ax.set_xticks(np.arange(len(total_labels)))
        ax.set_xticklabels(total_labels, rotation=45)
        ax.set_xlabel("Subsequent measurements")
        ax.set_ylabel(r"$\delta \pm SE_{\delta}$")
        ax.grid(True, linestyle="--", alpha=0.5)

        plt.tight_layout()
        plt.savefig(os.path.join(settings.MEDIA_ROOT, 'violin_plot.svg'))

    def post(self, request):
        try:
            headers = request.data.get('headers')
            raw_data = request.data.get('data')

            if not headers or not raw_data:
                return Response({'error': 'Missing headers or data'}, status=400)

            df = pd.DataFrame(raw_data, index=headers).T
            df = df.apply(pd.to_numeric, errors='coerce').fillna(0)

            spl_r = df['sample_ratio']
            std1_r = df['standard1_ratio']
            std2_r = df['standard2_ratio']
            spl_se = df['sample_se']
            std1_se = df['standard1_se']
            std2_se = df['standard2_se']

            delta = 1000 * (2 * spl_r / (std1_r + std2_r) - 1)

            f_abs = 2 * spl_r / (std1_r + std2_r)
            f_spl = spl_se / spl_r.replace(0, np.nan).fillna(1)
            f_std = np.sqrt(std1_se ** 2 + std2_se ** 2) / (std1_r + std2_r)
            delta_se = 1000 * np.abs(f_abs) * np.sqrt(f_spl ** 2 + f_std ** 2)

            shapiro_stat, shapiro_p = shapiro(delta)

            sd_mean, sd = self.calculate_sd(delta)
            inverse_sigma_mean, inverse_sigma = self.calculate_inverse_sigma(delta, delta_se)
            mc_mean, mc = self.calculate_mc(delta, delta_se)

            self.generate_half_violin_plot(delta, delta_se, sd_mean, sd, inverse_sigma_mean, inverse_sigma, mc_mean, mc)

            return Response({
                "delta": delta.tolist(),
                "deltaSe": delta_se.tolist(),
                "sd": {
                    "mean": sd_mean,
                    "uncertainty": sd
                },
                "inverseSigma": {
                    "mean": inverse_sigma_mean,
                    "uncertainty": inverse_sigma
                },
                "mc": {
                    "mean": mc_mean,
                    "uncertainty": mc
                },
                "shapiro": {
                    "statistic": shapiro_stat,
                    "p": shapiro_p
                }
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

