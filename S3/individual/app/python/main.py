from src.data.preprocess import preprocess
from src.data.generate import generate
from src.model import xgboost_model


def main():
    df = generate(n=10000, save=True)
    df = preprocess(df, save=True)

    model, accuracy, report = xgboost_model(df, save=True)

if __name__ == "__main__":
    main()
