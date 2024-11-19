# 下载地址
https://www.python.org/downloads/

# 配置环境
https://blog.csdn.net/CatStarXcode/article/details/79715530

python 3.12.6

C:\Users\14248\AppData\Local\Programs\Python\Python312

C:\Users\14248\AppData\Local\Programs\Python\Python310

# 设置pip
https://blog.csdn.net/qq_41650733/article/details/87902873

# jupyter lab 安装
https://blog.csdn.net/weixin_37641832/article/details/94437445

# 启动： jupyter lab --no-browser

# 运行python文件
%load test.py

%run test.py (与使用%load的不同点在于，该方法将在不加载代码到cell的前提下直接运行test.py得出结果)


安装依赖
 pip install -r requirements.txt



# pytorch离线下载 （https://download.pytorch.org/whl/torch_stable.html） 

# 安装pytorch
# //! `pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`


# VLLM
(https://docs.vllm.ai/en/latest/)

问题:error subprocess-exited-with-error问题
解决:pip install --upgrade setuptools



# 官方微调文档 https://github.com/QwenLM/Qwen/blob/main/README_CN.md 


# 训练 

# `PEFT https://github.com/huggingface/peft/blob/main/README.md`

  1: Parameter-Efficient Fine-Tuning (PEFT)
        `pip install 'peft<0.8.0' deepspeed`

# `deepspeed`
    2: deepspeed

# 单卡训练
    bash finetune/finetune_qlora_single_gpu.sh

# 量化
pip install auto-gptq optimum

# 模型合并

    AutoPeftModelForCausalLM

    from peft import AutoPeftModelForCausalLM
    model = AutoPeftModelForCausalLM.from_pretrained(
        path_to_adapter, # path to the output directory
        device_map="auto",
        trust_remote_code=True
    ).eval()

    merged_model = model.merge_and_unload()
    # max_shard_size and safe serialization are not necessary. 
    # They respectively work for sharding checkpoint and save the model to safetensors
    merged_model.save_pretrained(new_model_directory, max_shard_size="2048MB", safe_serialization=True)

# 分词器
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        path_to_adapter, # path to the output directory
        trust_remote_code=True
    )
    tokenizer.save_pretrained(new_model_directory)

# 模型源文件
config.json
model-00001-of-00002.safetensors qwen_generation_utils.py tokenizer_config.json
configuration_qwen.py
model-00002-of-00002.safetensors
qwen.tiktoken
cpp_kernels.py
modeling_qwen.py
special_tokens_map.json
generation_config.json
n model.safetensors.index.json
tokenization_qwen.py


# 数据地址: bash finetune/finetune_lora_single_gpu.sh


# .pth 文件
是 PyTorch 用来保存和加载模型权重或整个模型的文件格式。大模型的 .pth 文件通常存储的是经过训练后的神经网络的权重数据。

在大模型的场景下，比如 GPT、BERT、ViT 等模型，.pth 文件通常非常大，因为这些模型包含了数百万甚至数十亿个参数，训练这些模型需要大量的计算资源。

const a={
    "chats": [
        {
            "time": "11:02:45",
            "value": "这样的议论是针对谁呢？",
            "sender": "audience",
            "type": "textMessage",
            "label": {
                "question": true,
                "knowledge": false,
                "negative": false
            }
        },
        {
            "time": "11:08:38",
            "sender": "audience",
            "type": "textMessage",
            "value": "我也是一个从小被这样训到大的女生哦，总会被指责缺心少肺、没心眼儿、没眼力见儿、看不出来眉眼高低等等。不过在我成长一段时间之后，发现这件事情其实很简单，也没有什么大的问题。如果你愿意的话，可以找我聊聊，倾诉一下你遇到的事情，希望能够帮到你。我是树洞小太阳，欢迎你来找我玩❤",
            "label": {
                "question": false,
                "knowledge": false,
                "negative": false
            }
        },
        {
            "time": "11:15:17",
            "sender": "audience",
            "type": "textMessage",
            "value": "好惨",
            "label": {
                "question": false,
                "knowledge": false,
                "negative": false
            }
        },
        {
            "time": "11:15:35",
            "sender": "audience",
            "type": "textMessage",
            "value": "原生家庭也这么对你吗",
            "label": {
                "question": false,
                "knowledge": false,
                "negative": false
            }
        }
    ],
    "owner": "匿名",
    "title": "女 听过别人最多的议论就是干啥啥不行不长心眼没有脑子",
    "md5": "2f63d374c071043d9e1968aefa62ffb7"
}



# Flash Attention：高效注意力机制的突破与应用
    减少显存的占用 优化推理速度




# 向量数据库
    1:FAISS  https://blog.csdn.net/ResumeProject/article/details/135350945
    2:chroma (https://docs.trychroma.com/)

    1:图像向量

    2:文本向量




    3:语音向量

# Embedding: 非结构化数据转成向量的过程

    Vector Embedding

   # 创建索引(数据库)
`index=faiss.IndexFlatL2(256)`  # 线性搜索 L2表示使用相似度计算是：欧式距离

`index=faiss.IndexFlatIP(256)`  # 线性搜索 IP点积相似度

   # 工厂方法创建素引
`index faiss.index_factory(256,'Flat',faiss.METRIC_L2)`
`index faiss.index_factory(256,'Flat',faiss.METRIC_INNER_PRODUCT)`

   # 添加向量
`vectors np.random.rand(10000,256)`
`index.add(vectors)`
    
   # 删除向量
`index.remove_ids(np.array([1,2,3]))`  // np.array([1,2,3])
`print(index.ntotal)`
`index.reset()` 删除全部向量

    
   # 搜索向量
`query np.random.rand(2,256)`
`D,I index.search(query,k=2)` print(D) print(I)
    
   # 存储索引
`faiss.write_index(index,'vectors.faiss')`

   # 加载索引
`index faiss.read_index('vectors.faiss')`
    
# ID映射




# indexIVFFlat索引
先把数据进行分类(聚类)


# IndexIVFPQ   
Product Quantization（PQ）技术进行有损压缩，以节省内存


a = [1,3,4]  列表

a = {1,3,4}  集合  (不会出现重复的元素)  set() 

a = (1,3,4)  元组   (里面的元素不可以被修改)

a = {'n':1, 'm':2, [1,2]:'3'}  字典


def a(n,age=18,*args,**kwargs):
    if age >18:
        print(n)
    for i in args:
        print(i)
    else:
        print("no!")
        print(kwargs["ns"])
        print(kwargs["nt"])
a(1,196,2,3,6,9,ns=15,nt=16)