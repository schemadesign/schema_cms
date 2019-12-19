# Convert string columns to lowercase

text_columns = df.select_dtypes(
    exclude=["bool", "category", "datetime", "datetimetz", "timedelta", "number"]
).columns.tolist()

category_columns = df.select_dtypes(include=["category"]).columns.tolist()

df[text_columns] = df[text_columns].apply(lambda x: x.str.lower())

for category in category_columns:
    try:
        df[category].cat.rename_categories(lambda x: x.lower(), inplace=True)
    except ValueError as e:
        df[category] = df[category].str.lower().astype("category")
        continue
