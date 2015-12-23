echo "参数："
# echo "   -d 设备类型(波轮：DA, 滚筒：DB, 干衣机：DC)"
# echo "   -b 服务器监听IP地址（生产环节指定内网地址，测试环境可使用0.0.0.0）"
echo "   -s 服务器外网IP地址或域名（用于代码部署）"

while getopts "s:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
            #  d)
            #     echo "设备类型:$OPTARG" #参数存在$OPTARG中
            #     server_type=$OPTARG
            #     ;;
            #  b)
            #     echo "监听地址:$OPTARG"
            #     bind_host=$OPTARG
            #     ;;
             s)
                echo "部署服务器:$OPTARG"
                deploy_target=$OPTARG
                ;;
             ?) #当有不认识的选项的时候arg为?
            echo "unkonw argument"
        exit 1
        ;;
        esac
done

# if [ -z $server_type ]
# then
#   echo "请指定设备类型！"
#   exit 1
# elif [ -z $bind_host ]
# then
#   echo "请指定监听地址"
#   exit 1
# elif [ -z $deploy_target ]
if [ -z $deploy_target ]
then
  echo "请指定部署地址"
  exit 1
fi


#cnpm install
#grunt prepare --server_type=${server_type} --host=${bind_host}
cnpm install
slc build
slc deploy http://fengff:littleswan.app.2015@${deploy_target}:8701/
