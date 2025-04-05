from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import numpy as np
from scipy.stats import shapiro


class AnalyzeDataView(APIView):
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

            sd_mean = delta.mean()
            sd = delta.std(ddof=1)

            weights = 1 / delta_se
            inverse_sigma = np.sqrt(1 / weights.sum())
            inverse_sigma_mean = np.sum(delta * weights) / weights.sum()

            n = 10000
            mean_delta = delta.mean()
            sims = []

            for _ in range(n):
                noise = np.random.normal(0, delta_se)
                simulated = delta + noise - mean_delta
                sims.append(simulated.std())

            mc = np.mean(sims)
            mc_mean = mean_delta

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