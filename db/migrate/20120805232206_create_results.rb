class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.string :lastName
      t.string :firstName
      t.date :totalTime
      t.integer :bib
      t.string :country
      t.integer :divisionRank
      t.integer :overallRank
      t.date :swimTime
      t.date :bikeTime
      t.date :runTime

      t.timestamps
    end
  end
end
