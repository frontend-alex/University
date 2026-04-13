from src.data.preprocess import preprocess
from src.model.model import train_random_forest
from src.data.generate import generate

def main():

    df = generate(n=10000, save=True)

    df = preprocess(df, save=True)

    model, accuracy, report = train_random_forest(df)


if __name__ == "__main__":
    main()
