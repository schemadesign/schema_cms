# Remove trailing/following and inner two or more spaces
df['column name'] = df['column name'].str.replace(r'\s+', ' ').str.strip()
