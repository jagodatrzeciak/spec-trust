import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {setIsShowingModal} from "../redux/csvSlice.js";
import {useDispatch} from "react-redux";

export default function ReadmeModal({isShowingModal}) {
    const dispatch = useDispatch()

    const handleClose = () => dispatch(setIsShowingModal(false))

    return (
        <>
            <Modal show={isShowingModal} onHide={handleClose} size="lg" centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <img src="/spectrometer.png" alt="SpecTrust" width="30" height="30" />
                        uCalc-SSB Instructions
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>uCalc-SSB</strong> is a web-based application developed for the quantitative analysis and visualization of isotopic measurement uncertainty. It implements statistically rigorous methods—including bracketing-based δ (delta) value computation, uncertainty propagation, inverse-variance weighting, and Monte Carlo simulation—to provide researchers with reproducible, interpretable metrics of analytical precision. The platform supports both manual and batch (CSV-based) data entry and outputs numerical results alongside violin plots and scatter plots for comparative uncertainty assessment. Spec-Trust is designed to enhance transparency and consistency in isotopic data evaluation workflows.</p>
                    <hr/>
                    <h3>Key features:</h3>
                    <h5>1. Automated Delta and Uncertainty Calculations</h5>
                    <div className="ms-3">
                        <p>● Calculates δ values using bracketing method according to the following equation</p>
                        <div className="text-center my-4">
                            <img
                                src="/delta_equation1.png"
                                alt="Delta calculation equation"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                        <p>● Computes propagated standard error SE(δ) using</p>
                        <div className="text-center my-4">
                            <img
                                src="/sd_equation1.png"
                                alt="SE calculation equation"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                    </div>
                    <h5>2. Statistical validation</h5>
                    <p><strong>Shapiro–Wilk</strong> test is applied to assess whether the distribution of δ values can be considered normally distributed. This evaluation supports the underlying statistical assumptions required for parametric analyses and model-based inference. The null hypothesis (H₀) assumes normality (Δ ∼ 𝒩), while the alternative hypothesis (H₁) suggests otherwise. A sufficiently high p-value indicates that δ values do not significantly deviate from a normal distribution.</p>
                    <h5>3. Uncertainty computation</h5>
                    <p>The application implements three rigorous statistical approaches to summarize overall uncertainty in δ values:</p>
                    <div className="ms-3">
                        <p>● <strong>Standard Deviation of δ</strong> <br/>
                            A classic statistical measure that quantifies the spread of δ values around their mean.
                            It reflects the total random variability observed across repeated measurements,
                            without considering the individual standard errors associated with each measurement.
                            This method is straightforward but assumes that all δ values have comparable uncertainties.                        </p>
                        <p>● <strong>Inverse-σ Weighted Mean</strong> <br/>
                            This method is an adaptation of the inverse-variance weighted average approach.
                            Instead of using the inverse of the variance (σ²) for weighting, it uses the inverse of the standard deviation (σ).
                            Each δ value is weighted by the reciprocal of its standard deviation,
                            meaning measurements with lower uncertainties contribute more to the final mean.
                            This adjustment improves numerical stability when working with very small δ values and uncertainties,
                            as is common in high-precision isotopic measurements.
                        </p>
                        <p>● <strong>Monte Carlo Simulated Uncertainty</strong> <br/>
                            The Monte Carlo approach creates a large number of synthetic datasets by repeatedly adding random noise
                            (drawn from a normal distribution with a standard deviation equal to each measurement's standard error) to the δ values.
                            For each synthetic dataset, a standard deviation of δ values is calculated.
                            After many iterations (e.g., 10,000 simulations), the average of these simulated standard deviations
                            is taken as the Monte Carlo estimate of the total measurement uncertainty.</p>
                    </div>
                    <h5>4. Uncertainty visualization</h5>
                    <div className="ms-3">
                        <p>● <strong>Half violin plot</strong> provides a visual representation of the distribution and spread of δ values and their associated uncertainties. Each violin is centered on a measurement and shaped according to a normal distribution defined by its δ and SE(δ). Summary uncertainty estimates (SD, Inverse Sigma, MC) are also plotted as color-coded violins for comparative purposes.</p>
                        <div className="text-center my-4">
                            <img
                                src="/half_violin_plot_example.png"
                                alt="Half violin plot example"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                        <p>● <strong>Scatter plot with error bars</strong> displays δ values with vertical lines representing ± SE(δ). This plot allows users to assess consistency across measurements, identify outliers, and visually compare replicate data.</p>
                        <div className="text-center my-4">
                            <img
                                src="/scatter_plot_example.png"
                                alt="Scatter plot example"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                    </div>
                    <hr/>
                    <h3>Exemplary datasets</h3>
                    <p>All of our exemplary datasets can be found <a
                        href="https://drive.google.com/drive/folders/1DtlCLSTYBFxZo53G3e6bvQxm-fFPMsSm?usp=drive_link"
                        target="_blank" rel="noopener noreferrer">here</a>.</p>
                    <div className="ms-3">
                        <p>● <strong>BC10a</strong>- based on selenium isotope ratio measurements (⁸²Se/⁷⁸Se) in wheat flour reference material certified for selenium content,</p>
                        <p>● <strong>asw_selenium</strong>- selenium isotope ratio data measured in artificial seawater matrix, prepared for selenium-specific analysis,</p>
                        <p>● <strong>asw_uranium</strong>- uranium isotope ratio data (²³⁵U/²³⁸U) measured in a separate artificial seawater matrix, tailored for uranium analysis,</p>
                        <p>● <strong>water_sample</strong>- natural water samples (1 and 2) analyzed after uranium separation; used to assess recovery and matrix effects,</p>
                        <p>● <strong>ume2</strong>- uranium isotope ratio data from the UME2 certified standard, a well-characterized uranium reference material,</p>
                        <p>● <strong>u3o8</strong>- solid uranium oxide (U₃O₈) samples analyzed for both uranium content and isotopic composition.</p>
                    </div>
                    <hr/>
                    <h3>Step-by-Step Instructions</h3>
                    <div className="container col-12">
                        <img
                            src="/spectrust_gif.gif"
                            alt="Instruction GIF"
                            style={{ width: "100%"}}
                        />
                    </div>
                    <h5 className="mt-3">1. Choose Input Method</h5>
                    <div className="ms-3">
                        <p>● Click <strong>Manual Entry</strong> to enter values row by row or paste data from Excel file</p>
                        <p>● OR click <strong>CSV Upload</strong> to submit a <code>.csv</code> file formatted as described in the app</p>
                    </div>
                    <p>After uploading the data, the app will automatically begin processing. You’ll see a loading spinner while computations are running.</p>
                    <h5>2. View Your Results</h5>
                    <p>Explore the violin plot and scatter plot summarizing distribution and uncertainty.</p>
                    <p>Check the Shapiro-Wilk test result to assess normality.</p>
                    <p>Scroll to the interactive table to view all values per sample (δ, SE(δ)) and calculated uncertainty values.</p>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    );
}