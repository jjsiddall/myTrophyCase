class AddTrophyPositionToResults < ActiveRecord::Migration
  def change
  	add_column :results, :trophyPositionTop, :integer  	
  	add_column :results, :trophyPositionLeft, :integer
  end
end
