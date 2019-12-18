# Convert string columns to title

text_columns = df.select_dtypes(
    exclude=["bool", "category", "datetime", "datetimetz", "timedelta", "number"]
).columns.tolist()

category_columns = df.select_dtypes(include=["category"]).columns.tolist()

df[text_columns] = df[text_columns].apply(lambda x: x.str.title())

for category in category_columns:
    df[category].cat.rename_categories(lambda x: x.title(), inplace=True)
