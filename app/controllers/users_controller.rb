class UsersController < ApplicationController
  before_filter :check_for_logged_in, :only => :show
  before_filter :check_for_authorized, :only => :show

  def check_for_authorized
    if session[:user_id] != params[:id].to_i
        redirect_to root_url, notice: 'Not Authorized to View this Page'
      return
    end 
  end

  def new
  	@user = User.new
  end
  def create
  	@user = User.new(params[:user])
  	if @user.save
      session[:user_id] = @user.id
  		redirect_to user_url(@user.id), notice: "Welcome to My Trophy Case"
  	else
  		render "new"
  	end
  end
  def show
    @user = User.find(params[:id])
  end
end
