# Change NaN's to 0

categorical = df.select_dtypes(include="category").columns.tolist()
non_categorical = df.select_dtypes(exclude="category").columns.tolist()


for category in categorical:
    if "0" not in df[category].cat.categories:
        df[category].cat.add_categories("0", inplace=True)

cat_nan = {cat: "0" for cat in categorical}
non_cat_nan = {non: 0 for non in non_categorical}

df.fillna({**cat_nan, **non_cat_nan}, inplace=True)
