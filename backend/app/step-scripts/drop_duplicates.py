# Drop Duplicate Rows
df = df.drop_duplicates()

# Drop Duplicate Columns
# Take transpose of the data then remove duplicate rows only to take transpose again to get data
# back to original shape
df = df.T.drop_duplicates().T

# Combine
df = df.T.drop_duplicates().T.drop_duplicates()
