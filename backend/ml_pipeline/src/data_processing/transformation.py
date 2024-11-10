import tensorflow as tf
import pandas as pd
from typing import Dict, Any

class DataTransformer:
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        
    def transform_features(self, df: pd.DataFrame) -> tf.data.Dataset:
        # Numeric features
        numeric_features = ['age_years']
        
        # Categorical features
        categorical_features = ['gender']
        
        # Text features
        text_features = ['patient', 'title']
        
        # Create feature columns
        feature_columns = []
        
        # Numeric columns
        for header in numeric_features:
            feature_columns.append(tf.feature_column.numeric_column(header))
            
        # Categorical columns
        for header in categorical_features:
            vocab = df[header].unique()
            cat_col = tf.feature_column.categorical_column_with_vocabulary_list(
                header, vocab)
            feature_columns.append(tf.feature_column.indicator_column(cat_col))
        
        # Convert to tf.data.Dataset
        dataset = tf.data.Dataset.from_tensor_slices(dict(df))
        
        return dataset, feature_columns
