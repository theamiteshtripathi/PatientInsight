from tf_data_validation import DataValidator

# Initialize validator
validator = DataValidator()

# Run validation
results = validator.validate_data()

# Visualize statistics
validator.visualize_stats(results['stats'])

# Check for anomalies
if results['anomalies'].anomaly_info:
    print("Found anomalies:", results['anomalies'])
else:
    print("No anomalies found!") 