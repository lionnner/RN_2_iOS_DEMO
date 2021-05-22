# Uncomment the next line to define a global platform for your project

# 设置下载源
source 'https://github.com/CocoaPods/Specs.git'

# 导入我们自定义的脚本
require_relative './Podfile_ReactNative'

# 执行我们编写的RN环境检测代码
installReactNativeSdk()

# 设置RN配置 依赖，这里需要注意，不要使用 ../node_modules/,而是直接node_modules/
require_relative 'node_modules/react-native/scripts/react_native_pods'

require_relative 'node_modules/@react-native-community/cli-platform-ios/native_modules'

# 这里需要注意，RN 0.63版本必须iOS10.0以上版本才支持
platform :ios, '10.0'

install! 'cocoapods', :integrate_targets => false

inhibit_all_warnings!

target 'iOSRN634' do
  # Comment the next line if you don't want to use dynamic frameworks
  #use_frameworks!
  
  #use_native_modules!
  
  pod "RNGestureHandler", :path => "node_modules/react-native-gesture-handler"
  pod "RCTMJRefreshHeader", :path => "node_modules/react-native-mjrefresh"
  pod "react-native-webview", :path => "node_modules/react-native-webview"
  pod "RNCAsyncStorage", :path => "node_modules/@react-native-async-storage/async-storage"
  
  # 设置RN Path 依赖
  use_react_native!(:path => "node_modules/react-native")
  
#  use_flipper!({ 'Flipper' => '0.80.0' })
#  post_install do |installer|
#    flipper_post_install(installer)
#  end
  
end


