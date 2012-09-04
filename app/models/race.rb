class Race < ActiveRecord::Base
  attr_accessible :race_name, :race_type, :distance, :year, :race_web_id, :location, :raceMainURL, :raceResultURL
	
  has_many :results
end
