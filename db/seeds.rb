# encoding: utf-8
# Autogenerated by the db:seed:dump task
# Do not hesitate to tweak this to your needs

Result.create([
  { :racerName => "Ufret, German", :bib => 749, :country => "PRI", :divisionRank => 147, :overallRank => 727, :created_at => "2012-08-13 04:10:47", :updated_at => "2012-08-13 04:10:47", :totalTime => "2000-01-01 11:44:24", :swimTime => "2000-01-01 01:13:14", :bikeTime => "2000-01-01 05:46:44", :runTime => "2000-01-01 04:31:57", :user_id => 3 },
  { :racerName => "Hyre, Richard", :bib => 2011, :country => "USA", :divisionRank => 13, :overallRank => 1479, :created_at => "2012-08-13 04:11:02", :updated_at => "2012-08-13 04:11:02", :totalTime => "2000-01-01 13:38:57", :swimTime => "2000-01-01 01:09:57", :bikeTime => "2000-01-01 05:31:23", :runTime => "2000-01-01 06:43:09", :user_id => 3 }
], :without_protection => true )



User.create([
  { :email => "jacobsiddall@gmail.com", :password_digest => "$2a$10$tEWLHZRVSqKEa8xkVPHNiOhBOX/cMCcj0NfG2xgTNflybqujLDLJa", :created_at => "2012-08-12 05:25:08", :updated_at => "2012-08-12 05:25:08" },
  { :email => "j", :password_digest => "$2a$10$NiaH9fXaiDQiGNEu0mZrj./I097FHJbwEAOUcqNHNlaBU9M4p86le", :created_at => "2012-08-12 05:28:12", :updated_at => "2012-08-12 05:28:12" },
  { :email => "g", :password_digest => "$2a$10$MGU0MwsebcFcDQ0eCNGWmOiS/uHMTq2FhgeCGECkI.UHqtMsl10U2", :created_at => "2012-08-12 05:32:41", :updated_at => "2012-08-12 05:32:41" },
  { :email => "h", :password_digest => "$2a$10$qYN65WbrkFNvaRqlqynDyOmF4s2eFNcMpxhy0oG7wYtFvm/Z45hGK", :created_at => "2012-08-12 06:05:35", :updated_at => "2012-08-12 06:05:35" }
], :without_protection => true )


