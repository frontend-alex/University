# Project Architecture & Rationale

This document explains why the project is structured the way it is and what each part does.

---

## Data: Raw and Processed

The project keeps data in two places. The raw data lives in the data folder under a subfolder called raw. This is the original Titanic dataset exactly as it was downloaded, with no changes. We keep it untouched so we always have the source to go back to. The processed data lives in another subfolder called processed. This is where we save the cleaned and encoded dataset after preprocessing, and where the trained model file is stored. We separate raw from processed because raw data should never be modified by our code, while processed data is an output we can regenerate anytime from the raw data.

We process the data because the original CSV has categorical text values, missing values, and columns that are not useful for training. Machine learning models need numbers, not words, so we convert everything into a numeric form the model can use. We also drop columns that have too many missing values or that would leak the answer (like the boat column, which directly implies survival). The preprocessing step encodes passenger class and sex as integers, turns the embarkation port into binary flags, and saves the result so we do not have to repeat this work every time we train or predict.

---

## Source Code: Modular Structure

The actual Python code lives in a folder called src. This keeps all application logic in one place and separate from notebooks, config files, and data. Inside src we split the code into smaller modules, each with a single responsibility. This makes the project easier to understand, test, and extend.

The data module handles everything related to loading and preparing the dataset. It has a loader that reads the raw CSV from disk and can also load the preprocessed version. It has a preprocessing function that applies all the cleaning and encoding steps we described above. By putting this in its own module, any part of the project that needs data can import it from one place, and if we change how we load or preprocess data, we only change it in one file.

The models module handles training and prediction. The training function loads the data, preprocesses it, splits it into train and test sets, fits a decision tree classifier, and optionally saves the model to disk. The prediction function loads the saved model and runs it on new passenger data. Keeping training and prediction in a dedicated module means the main entry point stays simple, and we can swap or add models without touching the rest of the codebase.

The utils module holds shared configuration and helpers. Paths to data folders, feature names, and model parameters are defined in a config file so we do not scatter magic strings and numbers across the codebase. If we move the data folder or change the feature set, we update one file instead of hunting through every script.

---

## Entry Point and Notebooks

The main.py file at the root is the entry point when you run the project from the command line. It parses arguments, calls the training and prediction functions, and prints results. We keep it thin on purpose: it orchestrates the workflow but delegates the real work to the modules in src. This way the logic stays reusable, and we can also call the same functions from a notebook or another script.

The notebook folder contains Jupyter notebooks for exploration and experimentation. Notebooks are great for trying ideas and visualizing results, but they are not ideal for production code. By moving the core logic into src, we can use the same preprocessing and model code both in notebooks and in the main script, without duplicating logic or maintaining two versions.

---

## Configuration and Dependencies

The pyproject.toml file declares the project name, version, and dependencies. We list pandas and scikit-learn as required, and optionally Jupyter and plotting libraries for development. This makes it clear what the project needs and allows anyone to install everything with a single command. The .gitignore file tells Git which files to ignore, such as Python cache folders, virtual environments, and generated outputs like the processed CSV and model file. We track the raw data and source code, but not temporary or regenerable artifacts.

---

## Why This Structure Scales

As the project grows, we can add new data loaders, new preprocessing steps, or new models without cluttering a single file. Each module has a clear purpose, and changes in one area rarely break another. The config centralizes settings so we can tune parameters or switch datasets without editing dozens of files. This structure is common in professional Python projects and makes it easier for others to understand and contribute.
