from src.data.loader import load
from src.data.process import process

from src.config.config import RAW_CSV

def main():
    df = load(RAW_CSV)

    df = process(df)

    print(df.head())
    
if __name__ == "__main__":
    main()
