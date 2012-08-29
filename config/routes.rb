MyTrophyCase::Application.routes.draw do
  
  resources :races

  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
  get 'search', to: 'races#search'

  root :to => "sessions#new"
  
  resources :sessions
  
  resources :users do
  	resources :results
  end

end
