from src.data.generate import generate
from src.data.preprocess import preprocess
from src.models.random_forest import train_random_forest
from src.models.logistic_regression import train_logistic_regression


def main():
    df = generate(n=1500, seed=42, save=True)

    df = preprocess(df, save=True)

    model, accuracy, report = train_random_forest(df, save=True)


if __name__ == "__main__":
    main()
