PIPELINE_CONFIG = {
    'batch_size': 32,
    'validation_split': 0.2,
    'random_seed': 42,
    'features': {
        'numeric': ['age_years'],
        'categorical': ['gender'],
        'text': ['patient', 'title']
    }
}
