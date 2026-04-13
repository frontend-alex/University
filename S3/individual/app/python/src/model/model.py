import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, roc_auc_score

from src.config.config import (
    FEATURES,
    TARGET
)

def train_random_forest(
    df: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,

) -> tuple[RandomForestClassifier, float, str]:
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y # ? verifies that 80/20 ratio is perserved in both train/test 
                   # ? Always DO that with imbalanced datasets  
    )

    # * -> No SMOTE at all beacause when SMOTE is combinated with class_weight=balanced 
    # * -> they double compencate for the imabalnce making the model overcorrect towards predicting no-shows, which hurts the overral accuracy


    # param_grid = {
    #     "n_estimators"      : [200, 300, 500],  # ? How many trees in the foret -> more -> more stable  
    #     "max_depth"         : [None, 10, 20],    # ? How deep each tree grows -> None? -> Fully grown
    #     "min_samples_leaf"  : [1, 2, 4],         # ? Minimum rows at a leaf -> Higher -> Less overfiting
    # }
    
    # grid_search = GridSearchCV(
    #     estimator=RandomForestClassifier(
    #         class_weight="balanced", 
    #         random_state=random_state,
    #         n_jobs=1  
    #     ),
    #     param_grid=param_grid,
    #     cv=5,
    #     scoring="accuracy",
    #     n_jobs=-1,
    #     verbose=1
    # )
    
    # grid_search.fit(X_train, y_train)
    
    # print("Best Params", grid_search.best_params_)
    # model = grid_search.best_estimator_

    model = RandomForestClassifier(
        class_weight="balanced", 
        random_state=random_state,
        n_estimators=200
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    f1_noshow = f1_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Show", "No-Show"])
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*60}")
    print(f"  Random Forest — No-Show Prediction")
    print(f"{'='*60}")
    print(f"  Accuracy:      {accuracy:.4f}")
    print(f"  ROC-AUC:       {roc_auc:.4f}")
    print(f"  F1 (No-Show):  {f1_noshow:.4f}")
    print(f"\n{report}")
    print(f"  Confusion Matrix:")
    print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}  TP={cm[1][1]}")
    

    return model, accuracy, report
