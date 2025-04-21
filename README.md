# <img src="spec-trust/public/spectrometer.png" width="30" style="vertical-align: middle;"/> SpecTrust

**SpecTrust** is a web-based application developed for the quantitative analysis and visualization of isotopic measurement uncertainty. It implements statistically rigorous methods—including bracketing-based δ (delta) value computation, uncertainty propagation, inverse-variance weighting, and Monte Carlo simulation—to provide researchers with reproducible, interpretable metrics of analytical precision. The platform supports both manual and batch (CSV-based) data entry and outputs numerical results alongside violin plots and scatter plots for comparative uncertainty assessment. Spec-Trust is designed to enhance transparency and consistency in isotopic data evaluation workflows.

**Live App**: https://spec-trust.vercel.app

---

## Key features

### Automated Delta and Uncertainty Calculations
- Calculates δ values using bracketing method according to the following equation
  <p>
    <img src="assets/delta_equation.png" alt="Delta equation" style="max-width: 400px; display: block; margin: 0;" />
  </p>
  
- Computes propagated standard error SE(δ) using
  <p>
    <img src="assets/sd_equation.png" alt="SD equation" style="max-width: 350px; display: block; margin: 0;" />
  </p>


### Statistical validation
**Shapiro–Wilk** test is applied to assess whether the distribution of δ values can be considered normally distributed. This evaluation supports the underlying statistical assumptions required for parametric analyses and model-based inference. The null hypothesis (H₀) assumes normality (Δ ∼ 𝒩), while the alternative hypothesis (H₁) suggests otherwise. A sufficiently high p-value indicates that δ values do not significantly deviate from a normal distribution.

### Uncertainty computation

The application implements three rigorous statistical approaches to summarize overall uncertainty in δ values:
    
- **Standard Deviation of δ** 

    A classic statistical measure that represents the spread of δ values around their mean. It captures the random variation inherent in repeated measurements without taking individual uncertainties into account.
- **Inverse-σ Weighted Mean**

  A precision-weighted average of δ values, where measurements with smaller standard errors contribute more heavily. This method yields a more robust central estimate when individual uncertainties vary substantially.
- **Monte Carlo Simulated Uncertainty**

  An empirical method that introduces simulated random noise based on each measurement’s standard error to generate synthetic δ datasets. The average spread of these datasets provides a realistic estimate of total uncertainty.

### Uncertainty visualization

- **Half violin plot** provides a visual representation of the distribution and spread of δ values and their associated uncertainties. Each violin is centered on a measurement and shaped according to a normal distribution defined by its δ and SE(δ). Summary uncertainty estimates (SD, Inverse Sigma, MC) are also plotted as color-coded violins for comparative purposes.
    <p align="center">
        <img src="assets/half_violin_plot_example.png" alt="Half Violin Plot" style="max-width: 500px; display: block; margin: 0 auto;" />
    </p>  

- **Scatter plot with error bars** displays δ values with vertical lines representing ± SE(δ). This plot allows users to assess consistency across measurements, identify outliers, and visually compare replicate data.
    <p align="center">
        <img src="assets/scatter_plot_example.png" alt="Scatter plot" style="max-width: 500px; display: block; margin: 0 auto;" />
    </p>
 
### Exemplary datasets
All of our exemplary datasets can be found  [here](https://drive.google.com/drive/u/2/folders/1DtlCLSTYBFxZo53G3e6bvQxm-fFPMsSm).
- **BC10a**- based on selenium isotope ratio measurements (⁸²Se/⁷⁸Se) in wheat flour reference material certified for selenium content,
- **asw_selenium**- selenium isotope ratio data measured in artificial seawater matrix, prepared for selenium-specific analysis,
- **asw_uranium**- uranium isotope ratio data (²³⁵U/²³⁸U) measured in a separate artificial seawater matrix, tailored for uranium analysis,
- **woda**- natural water samples (1 and 2) analyzed after uranium separation; used to assess recovery and matrix effects,
- **ume2**- uranium isotope ratio data from the UME2 certified standard, a well-characterized uranium reference material,
- **u3o8**- solid uranium oxide (U₃O₈) samples analyzed for both uranium content and isotopic composition.

## Step-by-Step Instructions
### 1. Launch the App
Visit https://spec-trust.vercel.app
### 2. Choose Input Method
- Click **Manual Entry** to enter values row by row or paste data from Excel file
- OR click **CSV Upload** to submit a `.csv` file formatted as described in the app

After uploading the data, the app will automatically begin processing. You’ll see a loading spinner while computations are running.

### 3. View Your Results
Explore the violin plot and scatter plot summarizing distribution and uncertainty.

Check the Shapiro-Wilk test result to assess normality.

Scroll to the interactive table to view all values per sample (δ, SE(δ)).

## Local Development Setup
### Backend (Django)
```
cd backend
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver
```
### Frontend (React)
```
cd spec-trust
yarn install
yarn dev
```
Open `http://localhost:5173` to view the app.

## Built With
- 🧩 React + Redux Toolkit
- 🎨 Bootstrap 5
- 📈 Matplotlib
- 🔙 Django 
- 🧪 Scipy, Pandas, NumPy

## License
This application is provided for academic and research use only. Redistribution, modification, or commercial use is not permitted without prior written permission from the author.