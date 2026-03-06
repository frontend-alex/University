"""
Titanic Survival Rater - Entry point.

Usage:
    python main.py              # Train model and run demo predictions
    python main.py --train      # Train model only
    python main.py --predict    # Run demo predictions only (requires trained model)
"""

import argparse

from src.data import load_raw, preprocess
from src.models import train_model, predict_survival


def main():
    parser = argparse.ArgumentParser(description="Titanic Survival Rater")
    parser.add_argument("--train", action="store_true", help="Train the model")
    parser.add_argument("--predict", action="store_true", help="Run demo predictions")
    args = parser.parse_args()

    # Default: do both if no flag given
    do_train = args.train or (not args.train and not args.predict)
    do_predict = args.predict or (not args.train and not args.predict)

    if do_train:
        print("Loading data and training model...")
        df = load_raw()
        df = preprocess(df, save=True)
        model, X_train, X_test, y_train, y_test = train_model(df=df)
        print(f"Model trained. Train: {len(X_train)} samples, Test: {len(X_test)} samples.")

    if do_predict:
        print("\nDemo predictions:")
        # First class female, not from Cherbourg
        pred1 = predict_survival(pclass=1, sex=1, cherbourg=0)
        print(f"  1st class female, Southampton/Queenstown -> {'Survived' if pred1 else 'Did not survive'}")

        # Second class male, from Cherbourg
        pred2 = predict_survival(pclass=2, sex=0, cherbourg=1)
        print(f"  2nd class male, Cherbourg -> {'Survived' if pred2 else 'Did not survive'}")

        # First class male, from Cherbourg
        pred3 = predict_survival(pclass=1, sex=0, cherbourg=1)
        print(f"  1st class male, Cherbourg -> {'Survived' if pred3 else 'Did not survive'}")


if __name__ == "__main__":
    main()
