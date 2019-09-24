export const BLANK_CELLS = 'local:blank_cells.py';
const WHITE_SPACES = 'local:white_spaces.py';
const HANDLING_DUPLICATES = 'local:handeling_duplicates.py';
const CASE_CONVERSION = 'local:case_conversion.py';

export default {
  [BLANK_CELLS]: {
    key: BLANK_CELLS,
    body: `
      import pandas as pd
      import numpy as np
      
      """
      Here are some ways to handle blank cells
          1. Fill Blank cells with any value you want
          2. Forward or backward fill the values
          3. Remove rows with Blank cells
      """
      # Sample dataset
      df = pd.DataFrame(
          [[np.nan, 2, np.nan, 0], [3, 4, np.nan, 1], [np.nan, np.nan, np.nan, 5], [np.nan, 3, np.nan, 4]],
          columns=list('ABCD'),
      )
      
      """
      1. Fill
      """
      # Simple fill for entire dataset
      fill_value = 10
      df = df.fillna(fill_value)
      
      # Simple fill for specific field
      column_fill_value = 5
      df = df["A"].fillna(fill_value, inplace=True)
      
      """
      2. Forward and Backward fill
      """
      # forward fill for entire dataset (Fills with previous non-empty value)
      df = df.fillna(method="ffill")
      
      # forward fill column specific
      df = df["A"].fillna(method='ffill', inplace=True)
      
      # backward fill (Fills with next non-empty value)
      df = df.fillna(method="bfill")
      
      # backward fill column specific
      df = df["A"].fillna(method='bfill', inplace=True)
      
      """
      3. Drop rows
      It is not possible to just drop one blank cell. we would need to drop the whole row or column to
      clean our dataset so there can be two cases of blank cells in rows and columns.
      1. All cells are blank (empty row or column)
      2. One or more cells are blank (partially empty row or column)
      """
      # Empty Rows
      df = df.dropna(how='all', axis=0)
      # Empty Columns
      df = df.dropna(how='all', axis=1)
      
      # Empty Rows (specific column)
      df = df['A'].dropna(how='all', axis=0)
      # Empty Columns (specific column)
      df = df['A'].dropna(how='all', axis=1)
      
      # Partially empty Rows
      df = df.dropna(how='any', axis=0)
      # Partially empty Columns
      df = df.dropna(how='any', axis=1)
      
      # Partially empty Rows (specific column)
      df = df.dropna(how='any', axis=0)
      # Partially empty Columns (specific column)
      df = df.dropna(how='any', axis=1)
    `,
  },
  [WHITE_SPACES]: {
    key: WHITE_SPACES,
    body: `
      import pandas as pd
      
      
      df = pd.read_csv()
      
      
      # Remove trailing/following and inner two or more spaces
      df['column key'] = df['column key'].str.replace(r'\\s+', ' ').str.strip()
    `,
  },
  [HANDLING_DUPLICATES]: {
    key: HANDLING_DUPLICATES,
    body: `
      import pandas as pd
      
      df = pd.read_csv()
      
      # Drop Duplicate Rows
      df = df.drop_duplicates()
      
      # Drop Duplicate Columns
      # Take transpose of the data then remove duplicate rows only to take transpose again to get data
      # back to original shape
      df = df.T.drop_duplicates().T
      
      # Combine
      df = df.T.drop_duplicates().T.drop_duplicates()
    `,
  },
  [CASE_CONVERSION]: {
    key: CASE_CONVERSION,
    body: `
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
    `,
  },
};
