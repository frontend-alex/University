from src.data.preprocess import preprocess
from src.api.utils import get_model_artifact_path, load_model_bundle, score_people
from src.data.generate import generate
from src.model import train_xgboost_randomized_early_stopping


def main():
    df = generate(n=10000, save=True)
    df = preprocess(df, save=True)

    model, accuracy, report = train_xgboost_randomized_early_stopping(df, save=True)

if __name__ == "__main__":
    main()
