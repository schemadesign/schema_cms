"""
It is not possible to just drop one blank cell. we would need to drop the whole row or column to
clean our dataset so there can be two cases of blank cells in rows and columns.
1. All cells are blank (empty row or column)
2. One or more cells are blank (partially empty row or column)
"""
# Empty Rows
df = df.dropna(how='all', axis=0)
# Empty Columns
df = df.dropna(how='all', axis=1)
