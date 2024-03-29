import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress


def draw_plot():
  # Read data from file
  df = pd.read_csv('epa-sea-level.csv')

  # Create scatter plot
  plt.scatter(df['Year'], df['CSIRO Adjusted Sea Level'])

  # Create first line of best fit
  res = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
  x = pd.Series([i for i in range(1880, 2051)])
  plt.plot(x, res.intercept + res.slope * x, 'r', label='fitted line')

  # Create second line of best fit
  df_2000 = df[df['Year'] >= 2000]
  res_2000 = linregress(df_2000['Year'], df_2000['CSIRO Adjusted Sea Level'])
  x_2000 = pd.Series([i for i in range(2000, 2051)])
  plt.plot(x_2000,
           res_2000.intercept + res_2000.slope * x_2000,
           'g',
           label='fitted line 2000')

  # Add labels and title
  plt.xlabel('Year')
  plt.ylabel('Sea Level (inches)')
  plt.title('Rise in Sea Level')

  # Save plot and return data for testing (DO NOT MODIFY)
  plt.savefig('./output/sea_level_plot.png')
  return plt.gca()

