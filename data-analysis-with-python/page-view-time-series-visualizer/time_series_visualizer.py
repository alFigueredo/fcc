import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters

register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv(
    'fcc-forum-pageviews.csv',
    index_col='date',
    parse_dates=True,
)

# Clean data
df = df[(df['value'] >= df['value'].quantile(0.025))
        & (df['value'] <= df['value'].quantile(0.975))]


def draw_line_plot():
  # Draw line plot
  fig, ax = plt.subplots(figsize=(16, 6))
  ax.plot(df.index, df['value'], color='red')
  ax.set_title('Daily freeCodeCamp Forum Page Views 5/2016-12/2019')
  ax.set_xlabel('Date')
  ax.set_ylabel('Page Views')

  # Save image and return fig (don't change this part)
  fig.savefig('./output/line_plot.png')
  return fig


def draw_bar_plot():
  # Copy and modify data for monthly bar plot
  df_bar = df.copy()

  # Draw bar plot
  df_bar['year'] = df_bar.index.year
  df_bar['month'] = df_bar.index.month
  df_bar = df_bar.groupby(['year', 'month'])['value'].mean().unstack()
  df_bar.columns = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
  ]
  fig, ax = plt.subplots(figsize=(10, 6))
  df_bar.plot(kind='bar', ax=ax)
  ax.set_xlabel('Years')
  ax.set_ylabel('Average Page Views')
  ax.legend(title='Months')

  # Save image and return fig (don't change this part)
  fig.savefig('./output/bar_plot.png')
  return fig


def draw_box_plot():
  # Prepare data for box plots (this part is done!)
  df_box = df.copy()
  df_box.reset_index(inplace=True)
  df_box['year'] = [d.year for d in df_box.date]
  df_box['month'] = [d.strftime('%b') for d in df_box.date]

  # Draw box plots (using Seaborn)
  fig, ax = plt.subplots(1, 2, figsize=(16, 6))
  sns.boxplot(x='year',
              y='value',
              data=df_box,
              ax=ax[0],
              fliersize=1,
              hue='year')
  ax[0].set_title('Year-wise Box Plot (Trend)')
  ax[0].set_xlabel('Year')
  ax[0].set_ylabel('Page Views')
  sns.boxplot(x='month',
              y='value',
              data=df_box,
              ax=ax[1],
              order=[
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                  'Sep', 'Oct', 'Nov', 'Dec'
              ],
              fliersize=1,
              hue='month')
  ax[1].set_title('Month-wise Box Plot (Seasonality)')
  ax[1].set_xlabel('Month')
  ax[1].set_ylabel('Page Views')

  # Save image and return fig (don't change this part)
  fig.savefig('./output/box_plot.png')
  return fig

