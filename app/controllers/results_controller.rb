class ResultsController < ApplicationController
  before_filter :check_for_logged_in
  # before_filter :check_for_authorized_user

  # def check_for_authorized_user
  #   if session[:user_id] != params[:user_id].to_i
  #       redirect_to root_url, notice: 'You are not an authorized viewer of requested page'
  #     return
  #   end 
  # end
  
  # GET /results
  # GET /results.json
  def index
    @user = User.find( session[:user_id])
    @results = @user.results
    # @results = Result.all
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @results }
    end
  end

  # GET /results/1
  # GET /results/1.json
  def show
    @result = Result.find(params[:id])
    
    if @result.user_id != current_user.id
      redirect_to login_url, notice: 'You are not an authorized viewer of this result'
    end

  end

  # GET /results/new
  # GET /results/new.json
  def new
    #used to label the button on the Race Add/Edit pages
    @AddOrEditButton = "Add Race Result"
    #@Race = Race.new(params[:result])
    @result = Result.new
    @result.race_id = Race.find_by_race_web_id(params[:raceid]).id
  end

  # GET /results/1/edit
  def edit
    #used to label the button on the Race Add/Edit pages
    @AddOrEditButton = "Edit Race Result"

    @result = Result.find(params[:id])
    if @result.user_id != current_user.id
      redirect_to login_url, notice: 'You are not an authorized editor of this result'
    end
  end

  # POST /results
  # POST /results.json
  def create

    @result = Result.new(params[:result])

    respond_to do |format|
      if @result.save
        format.html { redirect_to result_path(@result), notice: 'Result was successfully created.' }
      else
        format.html { render action: "new" }
      end
    end
  end

  # PUT /results/1
  # PUT /results/1.json
  def update

    @result = Result.find(params[:id])

    respond_to do |format|
      if @result.update_attributes(params[:result])
        format.html { redirect_to result_path(@result), notice: 'Result was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @result.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /results/1
  # DELETE /results/1.json
  def destroy
    @result = Result.find(params[:id])
    @result.destroy
    redirect_to user_url(current_user), notice: 'Result Deleted' 

  end
end
