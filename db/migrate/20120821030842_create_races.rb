class CreateRaces < ActiveRecord::Migration
  def change
    create_table :races do |t|
      t.string :city
      t.string :state
      t.string :country
      t.string :distance
      t.string :race_type
      t.string :race_name

      t.timestamps
    end
  end
end
