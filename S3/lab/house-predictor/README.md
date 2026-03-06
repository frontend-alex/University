# House Price Predictor
This repository provides a foundational notebook designed to introduce students to machine learning using PyTorch Lightning. The example focuses on a [regression](https://en.wikipedia.org/wiki/Regression_analysis) problem, utilizing the Boston House Price dataset to predict the selling price of a house, which is a [continuous variable](https://en.wikipedia.org/wiki/Continuous_or_discrete_variable). To maintain clarity and facilitate understanding for those new to machine learning, the model architecture consists of a single fully connected layer. While I acknowledge that employing a neural network for such a straightforward regression task may not be the most practical approach in real-world scenarios, the primary goal of this exercise is to familiarize students with the PyTorch Lightning framework and evaluate model training outcomes.

![house-price-predictor](https://raw.githubusercontent.com/bshtmichielsen/house_price_predictor/refs/heads/main/BANNER.jpg)
*Image by Stable Diffusion: a robot selling houses in Boston*

This notebook is intentionally designed as a foundational starting point and does not strictly adhere to established best practices as it is meant as a learning opportunity. This repo belongs to a five part course:&nbsp;&nbsp;&nbsp; 🏠&nbsp;[House&nbsp;Price&nbsp;Predictor](https://github.com/bshtmichielsen/house_price_predictor)&nbsp;&nbsp;&nbsp; 🐏&nbsp;[Animal&nbsp;Sound&nbsp;Identifier](https://github.com/bshtmichielsen/animal_sound_identifier)&nbsp; &nbsp;👗&nbsp;[Clothing&nbsp;Sorter](https://github.com/bshtmichielsen/clothing_sorter)&nbsp;&nbsp;&nbsp; 🍎&nbsp;[Fruit&nbsp;Detector](https://github.com/bshtmichielsen/fruit_detector)&nbsp;&nbsp;&nbsp; 💬&nbsp;[Expert&nbsp;Chat](https://github.com/bshtmichielsen/expert_chat)&nbsp; Feel free to learn from the other parts too!

## 📚 Preparation
Please ensure that you are familiar with the following aspects in order to successfully work with this repo and notebook.
 - You know how to load data from and [work with CSV files](https://www.geeksforgeeks.org/python/working-csv-files-python/)
 - You know the basic structure of a [Pytorch Lightning](https://lightning.ai/docs/pytorch/stable/starter/introduction.html) project and its elements ([DataSet & DataModule](https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html), [LightningModule](https://lightning.ai/docs/pytorch/stable/common/lightning_module.html), [Trainer](https://lightning.ai/docs/pytorch/stable/common/trainer.html))
 - You understand the reasons for making [train, validate and test](https://en.wikipedia.org/wiki/Training%2C_validation%2C_and_test_data_sets) datasets.
 - You know [what an epoch](https://www.geeksforgeeks.org/machine-learning/epoch-in-machine-learning/) is.
 - You understand the purpose and value of regression evaluation metrics [Coefficient of determination (R²)](https://en.wikipedia.org/wiki/Coefficient_of_determination) and [Root Mean Square Error](https://en.wikipedia.org/wiki/Root_mean_square_deviation)

## 🎯 Learning opportunities
The following aspects of machine learning are part of this repo:
- Loading tabular data into a Tensor Dataset and making different loaders for different steps of the process.
- Defining a simple neural network and training it using deep-learning with epochs.
- Using a validation dataset to gauge the model's training gains.
- Evaluating a regression model's performance using standardized evaluation metrics for regression problems.

## 🤔 Considerations for improvement
This notebook is an example on how to get started, it is open for improvements and enhancements. Feel free to clone my work and use it to study and learn. Things to consider if you want to improve this work:
- A visualization of the errors at the end would be interesting.
- Calculating the R² and the RMSE of this model would help judging the model's performance. What do their values mean in relation to the case? 
- Regression models can be sensitive to the data being distributed normally. Is it in this project? If not, what can we do?

## ⭐ Citation & Star
If you use my work please cite and star ⭐ this repo. Thanks!
> Michielsen, Bas S.H.T. (2025) "House Price Predictor" GitHub: https://github.com/bshtmichielsen/house_price_predictor