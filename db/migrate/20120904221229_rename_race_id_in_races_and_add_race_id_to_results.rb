class RenameRaceIdInRacesAndAddRaceIdToResults < ActiveRecord::Migration
  def up
  	add_column :results, :race_id, :integer
    rename_column :races, :race_id, :race_web_id
  end

  def down
  	remove_column :results, :race_id
    rename_column :races, :race_web_id, :race_id
  end
end
