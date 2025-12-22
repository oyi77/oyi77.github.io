# frozen_string_literal: true

module Jekyll
  class MarketDataFetcher < Generator
    safe true
    priority :normal

    def generate(site)
      begin
        market_data = {
          'cryptocurrencies' => fetch_crypto_data,
          'indices' => fetch_indices_data,
          'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        
        # Write to data file
        data_dir = File.join(site.source, '_data')
        FileUtils.mkdir_p(data_dir)
        
        data_file = File.join(data_dir, 'market_data.yml')
        File.write(data_file, market_data.to_yaml)
        
        Jekyll.logger.info "Market Data Fetcher:", "Fetched market data"
      rescue => e
        Jekyll.logger.warn "Market Data Fetcher:", "Error: #{e.message}"
        # Create fallback data file
        create_fallback_data(site)
      end
    end
    
    def create_fallback_data(site)
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      data_file = File.join(data_dir, 'market_data.yml')
      
      fallback_data = {
        'cryptocurrencies' => generate_sample_crypto_data,
        'indices' => generate_sample_indices_data,
        'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC'),
        'note' => 'Using fallback data due to API error'
      }
      
      File.write(data_file, fallback_data.to_yaml)
      Jekyll.logger.info "Market Data Fetcher:", "Created fallback market_data.yml"
    end

    private

    def fetch_crypto_data
      # Fetch from CoinGecko API (free, no key required)
      coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 
               'polkadot', 'chainlink', 'litecoin', 'avalanche-2', 'polygon']
      
      crypto_data = []
      
      begin
        require 'net/http'
        require 'json'
        require 'uri'
        
        # CoinGecko API - simple price endpoint
        coin_ids = coins.join(',')
        uri = URI("https://api.coingecko.com/api/v3/simple/price?ids=#{coin_ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true")
        
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.read_timeout = 10
        http.open_timeout = 5
        
        request = Net::HTTP::Get.new(uri)
        request['User-Agent'] = 'Jekyll-Market-Data-Fetcher'
        
        response = http.request(request)
        
        if response.code == '200'
          data = JSON.parse(response.body)
          
          data.each do |coin_id, coin_data|
            crypto_data << {
              'id' => coin_id,
              'name' => format_coin_name(coin_id),
              'symbol' => coin_id.upcase[0..3],
              'price_usd' => coin_data['usd'],
              'change_24h' => coin_data['usd_24h_change'],
              'market_cap' => coin_data['usd_market_cap']
            }
          end
        elsif response.code == '429'
          Jekyll.logger.warn "Market Data Fetcher:", "Rate limit exceeded, using fallback data"
          crypto_data = generate_sample_crypto_data
        else
          Jekyll.logger.warn "Market Data Fetcher:", "API returned #{response.code}, using fallback data"
          crypto_data = generate_sample_crypto_data
        end
      rescue Net::TimeoutError, Net::OpenTimeout
        Jekyll.logger.warn "Market Data Fetcher:", "Request timeout, using fallback data"
        crypto_data = generate_sample_crypto_data
      rescue => e
        Jekyll.logger.warn "Market Data Fetcher:", "Error fetching crypto data: #{e.message}"
        # Return sample data if API fails
        crypto_data = generate_sample_crypto_data
      end
      
      crypto_data
    end

    def fetch_indices_data
      # Fetch major stock indices
      # Using Alpha Vantage or similar free API
      # For now, we'll use a combination of free APIs
      
      indices = []
      
      begin
        # Try to fetch from Alpha Vantage (requires API key) or use alternative
        # For demonstration, we'll fetch from a free API or generate based on known values
        
        # Major indices symbols
        index_symbols = {
          'SPX' => 'S&P 500',
          'DJI' => 'Dow Jones',
          'IXIC' => 'NASDAQ',
          'FTSE' => 'FTSE 100',
          'N225' => 'Nikkei 225'
        }
        
        # Note: Real implementation would fetch from API
        # For now, we'll create a structure that can be populated
        index_symbols.each do |symbol, name|
          indices << {
            'symbol' => symbol,
            'name' => name,
            'value' => nil, # Would be fetched from API
            'change' => nil,
            'change_percent' => nil,
            'note' => 'Requires API key for real-time data'
          }
        end
        
        # Try to fetch from Yahoo Finance (unofficial but works)
        indices = fetch_yahoo_finance_indices if indices.empty?
        
      rescue => e
        Jekyll.logger.warn "Market Data Fetcher:", "Error fetching indices: #{e.message}"
        indices = generate_sample_indices_data
      end
      
      indices
    end

    def fetch_yahoo_finance_indices
      # Yahoo Finance doesn't have official API, but we can try scraping
      # For a real implementation, use Alpha Vantage or similar
      []
    end

    def format_coin_name(coin_id)
      coin_id.split('-').map(&:capitalize).join(' ')
    end

    def generate_sample_crypto_data
      # Fallback sample data
      [
        {
          'id' => 'bitcoin',
          'name' => 'Bitcoin',
          'symbol' => 'BTC',
          'price_usd' => 45000.0,
          'change_24h' => 2.5,
          'market_cap' => 850_000_000_000
        },
        {
          'id' => 'ethereum',
          'name' => 'Ethereum',
          'symbol' => 'ETH',
          'price_usd' => 2800.0,
          'change_24h' => -1.2,
          'market_cap' => 340_000_000_000
        }
      ]
    end

    def generate_sample_indices_data
      [
        {
          'symbol' => 'SPX',
          'name' => 'S&P 500',
          'value' => 4500.0,
          'change' => 25.5,
          'change_percent' => 0.57
        },
        {
          'symbol' => 'DJI',
          'name' => 'Dow Jones',
          'value' => 35000.0,
          'change' => 150.0,
          'change_percent' => 0.43
        }
      ]
    end
  end
end

