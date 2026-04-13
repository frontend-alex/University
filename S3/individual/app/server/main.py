from src.data.generate import generate
from src.data.preprocess import preprocess

from src.models.model import train_random_forest


def main():
    df = generate(n=10000, seed=42, save=True)

    df = preprocess()

    model, accuracy, report = train_random_forest(df)


if __name__ == "__main__":
    main()
