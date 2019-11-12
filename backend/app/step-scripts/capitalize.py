# # Only First word of first sentense is capatalised and everything else is converted to lowercase.

df_subset = df.select_dtypes(exclude=["bool", np.number])
text_columns = df_subset.columns.tolist()


def cap(match):
    return match.group().capitalize()


for column in text_columns:
    df[column] = df[column].astype(str)
    df[column] = df[column].str.replace(r'\s+', ' ').str.strip()
    df[column] = df[column].apply(lambda x: re.sub(r'((?<=[\.\?!]\s)(\w+)|(^\w+))', cap, x))
