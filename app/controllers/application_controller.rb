class ApplicationController < ActionController::Base
  protect_from_forgery

private
  def current_user
  	@current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def check_for_logged_in
    if current_user.nil?
    	redirect_to login_url, alert: "Please Login" 
		return
	end
  end

end
