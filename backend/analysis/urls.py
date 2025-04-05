from django.urls import path
from .views import AnalyzeDataView

urlpatterns = [
    path('analyze/', AnalyzeDataView.as_view(), name='analyze-data'),
]