# 定义一个函数，在 Podfile文件中调用此函数即可
def installReactNativeSdk()

    # 设置 react_native_pods.rb 文件路径
    node_mudle_pod_file = "node_modules/react-native/scripts/react_native_pods.rb"

    # 判断该文件是否存在，如果已经存在，表示RN环境已经配置，如果没有存在表示RN环境还未集成到项目
    if File.exist?(node_mudle_pod_file)
        Pod::UI.puts "\nReactNative 环境已存在！\n\n"
    else
        Pod::UI.puts "ReactNative 环境不存在，准备下载···"
        # 判断是否安装 node环境
        if system "node -v > /dev/null"
            # 使用 yarn 或 npm 下载依赖
            if system "yarn install || npm install"
                Pod::UI.puts "ReactNative 环境安装成功！\n\n"
            else
                Pod::UI.puts "ReactNative 环境安装失败！请安装yarn，在命令行执行：npm install -g yarn"
                Kernel.exit(false)
            end
        else
            #如果没有安装，提示自行安装node环境
            Pod::UI.puts "环境下载失败！请先安装node环境，详细见：https://reactnative.cn/docs/environment-setup"
            Kernel.exit(false)
        end
    end
end


