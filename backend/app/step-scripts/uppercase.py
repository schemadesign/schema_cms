import numpy as np

df_subset = df.select_dtypes(exclude=["bool", np.number])
text_columns = df_subset.columns.tolist()

for column in text_columns:
    df[column] = df[column].str.upper()
