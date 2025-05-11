import io
import zipfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import numpy as np
from scipy.stats import shapiro, norm
import matplotlib.pyplot as plt
import os
import matplotlib.lines as mlines

from backend.settings import MEDIA_ROOT


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
            x_vals = np.linspace(mu - 3*sigma, mu + 3*sigma, 200)
            pdf_vals = norm.pdf(x_vals, loc=mu, scale=sigma)

            ax.fill_betweenx(x_vals, i + pdf_vals / pdf_vals.max() * 0.4, i,
                     facecolor='grey', alpha=0.5)

        stats = [
            ("SD", sd_mean, sd, '#6ca6cd'),
            ("Inverse-σ", inverse_sigma_mean, inverse_sigma, '#ad7f97'),
            ("MC", mc_mean, mc, '#ff8f89')
        ]

        offset = len(delta)
        for j, (label, mu, sigma, color) in enumerate(stats):
            x_vals = np.linspace(mu - 3 * sigma, mu + 3 * sigma, 100)
            pdf_vals = norm.pdf(x_vals, loc=mu, scale=sigma)
            index = offset + j
            ax.fill_betweenx(x_vals, index + pdf_vals / pdf_vals.max() * 0.4, index,
                         facecolor=color, alpha=0.5, label=label)

        box_data = []
        for mu, sigma in zip(delta, delta_se):
            samples = np.random.normal(mu, sigma, 1000)  # simulate samples from the uncertainty
            box_data.append(samples)

        for method in stats:
            samples = np.random.normal(method[1], method[2], 1000)
            box_data.append(samples)

        ax.boxplot(
            box_data,
            positions=np.arange(0, len(delta) + 3),
            widths=0.3,
            patch_artist=True,
            boxprops=dict(facecolor='white', color='black'),
            medianprops=dict(color='black'),
            whiskerprops=dict(color='black'),
            capprops=dict(color='black'),
            showfliers=False
        )

        x_axis = np.arange(1, len(delta) + 1)
        xtick_positions = [i - 1 for i in list(x_axis) + [x_axis[-1] + 1, x_axis[-1] + 2, x_axis[-1] + 3]]
        xtick_labels = [str(i) for i in range(1, len(delta) + 1)] + ["SD", "Inverse-σ", "MC"]

        ax.set_xticks(xtick_positions)
        ax.set_xticklabels(xtick_labels)
        ax.tick_params(axis='both', which='major', labelsize=13)

        for label in ax.get_xticklabels()[-3:]:
            label.set_rotation(45)
            label.set_ha('right')

        ax.set_ylabel(r"$\delta \pm SE_{\delta}$", fontsize=15)
        ax.grid(True, linestyle="--", alpha=0.5)
        ax.legend(loc='upper center', ncol=3, fontsize=11)

        plt.tight_layout()
        plt.savefig(os.path.join(MEDIA_ROOT, 'violin_plot.png'))
        plt.savefig(os.path.join(MEDIA_ROOT, 'violin_plot.pdf'))

    def generate_scatter_plot(self, delta, delta_se, sd_mean, sd, inverse_sigma_mean, inverse_sigma, mc_mean, mc):
        stats = [
            ("SD", sd_mean, sd, '#6ca6cd'),
            ("Inverse-σ", inverse_sigma_mean, inverse_sigma, '#ad7f97'),
            ("MC", mc_mean, mc, '#ff8f89')
        ]

        fig, ax = plt.subplots(figsize=(10, 6))

        x_axis = np.arange(1, len(delta) + 1)
        ax.errorbar(x_axis, delta, yerr=delta_se, fmt='o', color='black', capsize=4)

        for i in range(3):
            ax.errorbar(x_axis[-1] + i + 1, stats[i][1], yerr=stats[i][2], fmt='o', color=stats[i][3], label=stats[i][0], capsize=4)

        xtick_positions = list(x_axis) + [x_axis[-1] + 1, x_axis[-1] + 2, x_axis[-1] + 3]
        xtick_labels = [str(i) for i in range(1, len(delta) + 1)] + ["SD", "Inverse-σ", "MC"]

        ax.set_xticks(xtick_positions)
        ax.set_xticklabels(xtick_labels)
        ax.tick_params(axis='both', which='major', labelsize=13)

        for label in ax.get_xticklabels()[-3:]:
            label.set_rotation(45)
            label.set_ha('right')

        ax.set_ylabel(r"$\delta \pm SE_{\delta}$", fontsize=14)
        ax.grid(True, linestyle='--', alpha=0.7)
        custom_lines = [
            mlines.Line2D([], [], color='#6ca6cd', marker='o', linestyle='None', markersize=8, label='SD'),
            mlines.Line2D([], [], color='#ad7f97', marker='o', linestyle='None', markersize=8, label='Inverse-σ'),
            mlines.Line2D([], [], color='#ff8f89', marker='o', linestyle='None', markersize=8, label='MC')
        ]

        ax.legend(
            handles=custom_lines,
            loc='upper center',
            fontsize=11,
            ncol=3
        )

        plt.tight_layout()
        plt.savefig(os.path.join(MEDIA_ROOT, 'scatter_plot_example.png'))
        plt.savefig(os.path.join(MEDIA_ROOT, 'scatter_plot.pdf'))

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
            self.generate_scatter_plot(delta, delta_se, sd_mean, sd, inverse_sigma_mean, inverse_sigma, mc_mean, mc)

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
