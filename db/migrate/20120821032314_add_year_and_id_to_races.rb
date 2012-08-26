class AddYearAndIdToRaces < ActiveRecord::Migration
  def change
  	add_column :races, :race_id, :integer
  	add_column :races, :year, :integer
  end
end
