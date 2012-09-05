class RemoveCityStateCountryAddLocationToRaces < ActiveRecord::Migration
  def up
  	remove_column :races, :city
  	remove_column :races, :state
  	remove_column :races, :country
  	add_column :races, :location, :string
    
  end

  def down
  	add_column :races, :city, :string
  	add_column :races, :state, :string
  	add_column :races, :country, :string
  	remove_column :races, :location
  end
end
