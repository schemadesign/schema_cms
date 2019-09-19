import pandas as pd

df = pd.DataFrame({'Place': ['newyork', 'Washington', 'Newyork', 'WASHIngton'],
                   'var1': ['XSD', 'wer', 'xyz', 'zyx']})
# Uppercase
df = df['var1'].str.upper()
# lowercase
df = df['var1'].str.lower()
# Title case
df = df['var1'].str.title()
# Sentence Case
df = df['var1'].str.capitalize()
