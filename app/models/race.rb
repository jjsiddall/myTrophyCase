class Race < ActiveRecord::Base
  attr_accessible :race_name
	
  has_many :results
end
