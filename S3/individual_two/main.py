from src.model.random_forest import train_rf

from src.data.loader import load
from src.config.config import RAW_CSV

def main():
    df = load(RAW_CSV)

    model, accuracy = train_rf(df)

    print(df.head())
    
if __name__ == "__main__":
    main()
