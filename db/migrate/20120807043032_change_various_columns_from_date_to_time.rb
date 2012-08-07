class ChangeVariousColumnsFromDateToTime < ActiveRecord::Migration
  def up
    remove_column :results, :totalTime
    remove_column :results, :swimTime
    remove_column :results, :bikeTime
    remove_column :results, :runTime

    add_column :results, :totalTime, :time
    add_column :results, :swimTime, :time
    add_column :results, :bikeTime, :time
    add_column :results, :runTime, :time

  end

  def down
    remove_column :results, :totalTime
    remove_column :results, :swimTime
    remove_column :results, :bikeTime
    remove_column :results, :runTime

    add_column :results, :totalTime, :date
    add_column :results, :swimTime, :date
    add_column :results, :bikeTime, :date
    add_column :results, :runTime, :date

  end
end
