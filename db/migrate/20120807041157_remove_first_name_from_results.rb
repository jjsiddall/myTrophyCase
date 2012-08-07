class RemoveFirstNameFromResults < ActiveRecord::Migration
  def up
    remove_column :results, :firstName
	rename_column :results, :lastName, :racerName
  end

  def down
    add_column :results, :firstName, :string
  	rename_column :results, :racerName, :lastName
  end

end
