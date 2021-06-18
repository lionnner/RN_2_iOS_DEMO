require_relative 'node_modules/react-native/scripts/react_native_pods'
require_relative 'node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '10.0'

install! 'cocoapods', :integrate_targets => false

inhibit_all_warnings!

target 'iOSRN634' do
  
  reactNativePath = use_native_modules!
  
  use_react_native!(:path => reactNativePath)
end

