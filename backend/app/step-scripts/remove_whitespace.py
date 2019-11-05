import numpy as np


# Drop All Completely empty rows and columns
df = df.dropna(how='all', axis=0)
df = df.dropna(how='all', axis=1)


# Copy the df to avoid assignment
num_df = df.copy()
# Getting the column names of potentially numeric values in a temp dataset
df_subset = num_df.select_dtypes(exclude=["bool", np.number])
text_columns = df_subset.columns.tolist()

for column in text_columns:
    num_df[column] = num_df[column].str.replace(r'\s+', '').str.strip()
    try:
        num_df[column] = num_df[column].astype(np.float)
        num_df[column] = num_df[column].astype(np.int)
    except ValueError:
        pass


# Getting numberic field values previously detected as string
df_subset = num_df.select_dtypes(include=[np.number])
num_columns = df_subset.columns.tolist()


# Correcting Numeric Fields
for column in num_columns:
    df[column] = df[column].str.replace(r'\s+', '').str.strip()


# Correcting % columns
for column in text_columns:
    check_percent = list(set(df[column].tolist()))
    for item in check_percent:
        try:
            if item[-1] == "%" and type(int(item[:-1].replace(" ", ""))) == int:
                df[column] = df[column].str.replace(r'\s+', '').str.strip()
            else:
                pass
        except (TypeError, ValueError) as e:
            pass

# Correcting String
for column in text_columns:
    df[column] = df[column].str.replace(r'\s+', ' ').str.strip()
