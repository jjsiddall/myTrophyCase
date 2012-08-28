class AddRaceUrlsToRaces < ActiveRecord::Migration
  def change
  	  	add_column :races, :raceResultURL, :string  	
  	  	add_column :races, :raceMainURL, :string
  end
end
